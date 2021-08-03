import { Request, Response } from 'express';
import { Buffer } from 'buffer';


const SIZE: number = 12500; // 100000 / 8 = 12500
let zipCodes = Buffer.alloc(SIZE, 0); // 12.5 kilobytes


const insertZipCode = async (req: Request, res: Response) => {
    let zipCode: number = req.body.zipCode;

    let octetAddress: number = Math.floor(zipCode / 8);
    let bitPosition: number = zipCode % 8;

    zipCodes[octetAddress] |= (1 << bitPosition);

    return res.send(
        'Zip code ' + zipCode.toString().padStart(5, "0") + ' inserted.'
    );
};


const deleteZipCode = async (req: Request, res: Response) => {
    let zipCode: number = +req.params.id;
    
    let octetAddress: number = Math.floor(zipCode / 8);
    let bitPosition: number = zipCode % 8;

    zipCodes[octetAddress] &= ~(1 << bitPosition);
    
    return res.send(
        'Zip code ' + zipCode.toString().padStart(5, "0") + ' deleted.'
    );
};


const hasZipCode = async (req: Request, res: Response) => {
    let zipCode: number = +req.params.id;
    
    let octetAddress: number = Math.floor(zipCode / 8);
    let bitPosition: number = zipCode % 8;

    return res.send(
        exists(octetAddress, bitPosition)
    );
};


const displayZipCodes = async (req: Request, res: Response) => {
    let existingCodes: string[] = [];
    let nextElement: string = "";

    let previousExists: boolean = false;
    let secondPreviousExists: boolean = false;

    let octetAddress: number = 0;
    let bitPosition: number = 0;

    for(; octetAddress < SIZE; ++octetAddress) {
        for(bitPosition = 0; bitPosition < 8; ++bitPosition) {
            let currentExists: boolean = exists(octetAddress, bitPosition);

            if(currentExists) {
                if(! previousExists) {
                    nextElement = (octetAddress * 8 + bitPosition).toString().padStart(5, "0");
                }
            } else {
                if(previousExists) {
                    if(secondPreviousExists) {
                        nextElement += '-' + (octetAddress * 8 + bitPosition - 1).toString().padStart(5, "0");
                    }

                    existingCodes.push(nextElement);
                    nextElement = "";
                }
            }

            secondPreviousExists = previousExists;
            previousExists = currentExists;
        }
    }

    if(previousExists) {
        if(secondPreviousExists) {
            nextElement += '-' + (octetAddress * 8 + bitPosition - 1).toString().padStart(5, "0");
        }

        existingCodes.push(nextElement);
    }

    return res.send(
        existingCodes.join(', ')
    );
};


function exists(octetAddress: number, bitPosition: number): boolean {
    return (zipCodes[octetAddress] & (1 << bitPosition)) > 0;
};


export default { insertZipCode, deleteZipCode, hasZipCode, displayZipCodes };
