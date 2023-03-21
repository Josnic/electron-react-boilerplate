import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import DOMPurify from 'dompurify';
import TextField from '@mui/material/TextField';
import ButtomCustom from '../../ButtonRound';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const CoachingQuestion = ({ data }) => {
    const names = [
        'Oliver Hansen'
      ];
      
    const [personName, setPersonName] = React.useState<string[]>([]);
    const handleChangeMultiple = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const { options } = event.target;
        const value: string[] = [];
        for (let i = 0, l = options.length; i < l; i += 1) {
        if (options[i].selected) {
            value.push(options[i].value);
        }
        }
        setPersonName(value);
    };

    const html = `lorem <b onmouseover="alert('mouseover');">ipsum  ioihio pohpioh pohjpoij pojpoj pohiop pohpoi pojhpoi pòjpo pojhpo pohpoi  umi psumv ipsum vv ipsum </b>`
    const sanitizedData = () => ({
        __html: DOMPurify.sanitize(html)
    })

    return (
        <Grid container columns={{ xs: 4, md: 12 }} spacing={2}>
            <Grid item xs={12}>
                <div
                    dangerouslySetInnerHTML={sanitizedData()}
                />
            </Grid>
            <Grid item xs={12}>
                <div className="question-container">
                    <div className='question'>
                        <div
                            dangerouslySetInnerHTML={sanitizedData()}
                        />
                    </div>
                    <div className='answer-container'>
                        <FormControl sx={{ m: 1, minWidth: 120, width: "100%" }}>
                            <Select
                                multiple
                                native
                                value={personName}
                                // @ts-ignore Typings are not considering `native`
                                onChange={handleChangeMultiple}
                                label=""
                                inputProps={{
                                    id: 'select-multiple-native',
                                }}
                                >
                                {names.map((name) => (
                                    <option key={name} value={name}>
                                    {name}
                                    </option>
                                ))}
                            </Select>
                        </FormControl>
                    </div>

                    <div className='question'>
                        <div
                            dangerouslySetInnerHTML={sanitizedData()}
                        />
                    </div>
                    <div className='answer-container'>
                        <FormControl sx={{ m: 1, minWidth: 120, width: "100%" }}>
                            <TextField
                                id="outlined-multiline-static"
                                label=""
                                multiline
                                rows={4}
                                defaultValue=""
                            />
                        </FormControl>
                    </div>
                </div>
            </Grid>

            <Grid item xs={12} className='lessons-button-container-center'>
                <ButtomCustom variant="contained" rounded>
                    Continuar
                </ButtomCustom>
            </Grid>
        </Grid>
    )
}

export default CoachingQuestion;