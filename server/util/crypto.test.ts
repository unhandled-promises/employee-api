import Encryption from "./crypto";

describe("crypto tests", () => {
    const validationString = "uniquepassword";

    it("should encrypt a string and return a hashed password", () => {
        const encryptString = Encryption.encrypt(validationString);

        expect(encryptString).not.toEqual(validationString);
    });

    it("should decrypt a string and return the original", () => {
        const encryptString = Encryption.encrypt(validationString);
        const decryptString = Encryption.decrypt(encryptString);

        expect(encryptString).not.toEqual(validationString);
        expect(decryptString).toEqual(validationString);
    });

    it("should randomly create an 8 character alphanumeric string", () => {
        const token = Encryption.createVerificationCode();

        expect(token).toHaveLength(8);
        expect(token).toEqual(expect.stringMatching(/^([A-Z0-9_-]){8}$/));
    });
});
