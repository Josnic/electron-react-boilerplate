import { PDFDocument, PDFForm, StandardFonts, TextAlignment, setFontAndSize, PDFFont } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { getPathCourseResource, getBinaryContent } from '../utils/electronFunctions';
import * as download from 'downloadjs/download';

const base64ToArrayBuffer = (base64String) => {
    const base64 = base64String.indexOf(";base64,") != -1 ? base64String.split(";base64,")[1] : base64String
    var binaryString = atob(base64);
    var bytes = new Uint8Array(binaryString.length);
    for (var i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
} 

export default async(objText, arObjImage, pdfDocumentPath, additionalFonts) => {
    const fileBytes = await getBinaryContent(pdfDocumentPath);
    const pdfDoc = await PDFDocument.load(fileBytes);
    const arFonts = [];
    if (additionalFonts && Array.isArray(additionalFonts)){
        pdfDoc.registerFontkit(fontkit);
        for (let i = 0; i < additionalFonts.length; i++){
            const fontBinary = await getBinaryContent(additionalFonts[i].font);
            arFonts.push({
                name: additionalFonts[i].name,
                font: await pdfDoc.embedFont(fontBinary)
            })
        }
    }
    
    const form = pdfDoc.getForm();
    Object.entries(objText).forEach(([key, value]) => {
        let textField = form.getTextField(key);
        textField.setText(value.value);
        if (value.textAlign){
            textField.setAlignment(TextAlignment[value.textAlign]);
        }

        if (value.fontSize){
            textField.setFontSize(value.fontSize);
        }
        if (value.fontFamily){
            const fontTTF = arFonts.filter(ele => ele.name == value.fontFamily);
            if (fontTTF.length > 0){
                textField.updateAppearances(fontTTF[0].font)
            }
        }
    });
    for (let i = 0; i < arObjImage.length; i++) {
        let textFieldImage = form.getTextField(arObjImage[i].textField);
        let embedImage = null;
        if (arObjImage[i].type == "png") {
            embedImage = await pdfDoc.embedPng(base64ToArrayBuffer(arObjImage[i].image));
        }else{
            embedImage = await pdfDoc.embedJpg(base64ToArrayBuffer(arObjImage[i].image));
        }
        if (arObjImage[i].textAlign){
            textFieldImage.setAlignment(TextAlignment[arObjImage[i].textAlign]);
         }
        textFieldImage.setImage(embedImage);
        
    }
    const pdfBytes = await pdfDoc.save();
    const filenameParts = pdfDocumentPath.split("/");
    const filename = filenameParts[filenameParts.length - 1];
    download(pdfBytes, filename, "application/pdf");
}