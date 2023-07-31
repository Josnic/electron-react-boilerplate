import { PDFDocument } from 'pdf-lib';
import { getPathCourseResource, getBinaryContent } from '../utils/electronFunctions';
import * as download from 'downloadjs/download';

const base64ToArrayBuffer = (base64) => {
    var binaryString = atob(base64);
    var bytes = new Uint8Array(binaryString.length);
    for (var i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
} 

export default async(objText, arObjImage, pdfDocumentPath) => {
    const fileBytes = await getBinaryContent(pdfDocumentPath)
    const pdfDoc = await PDFDocument.load(fileBytes);
    const form = pdfDoc.getForm();
    Object.entries(objText).forEach(([key, value]) => {
        let textField = form.getTextField(key);
        textField.setText(value);
    });
    for (let i = 0; i < arObjImage.length; i++) {
        let textFieldImage = form.getTextField(arObjImage[i].textField);
        let embedImage = null;
        if (arObjImage[i].type == "png") {
            embedImage = await pdfDoc.embedPng(base64ToArrayBuffer(arObjImage[i].image));
        }else{
            embedImage = await pdfDoc.embedJpg(base64ToArrayBuffer(arObjImage[i].image));
        }
        textFieldImage.setImage(embedImage);
    }
    const pdfBytes = await pdfDoc.save();
    const filenameParts = pdfDocument.split("/");
    const filename = filenameParts[filenameParts.length - 1];
    download(pdfBytes, filename, "application/pdf");
}