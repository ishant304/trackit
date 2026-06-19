import z from "zod";

export const geminiSchema = z.object({
    success: z.boolean().describe("if the given file resemble anything of bank statement the true otherwise false and return empty statement array"),
    statement: z.array(
        z.object({
            amount: z.number().
            describe("the amount of the transaction"),

            description: z.string().
            describe("write in this format only '<method of transaction eg. UPI, atm withdrawal, card, neft, etc.> payment to <individual or organisation name>' if there is any other type of charges like bank charges, sms charges or others handle it otherwise by just writing <reason for charge> charges. For bank withdrawal just use Bank withdrawal at <place name if none given then use unknown place>. For bills use '<billing reason> bill'"),

            date: z.string().
            describe("date of the transcation given in format DD-MM-YYYY"),

            category: z.
            enum(["rent", "food", "travel", "bills", "misc","entertainment", "shopping", "others"]).
            describe("read the transaction detail and then if the transaction is to a individual then write misc if it is to an organisational name then use what that organisation resembles most")
        })
    )
})
