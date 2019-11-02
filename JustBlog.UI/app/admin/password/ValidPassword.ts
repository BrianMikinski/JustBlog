

export interface ValidPassword {
    has6Characters: boolean,
    hasLowerCase: boolean,
    hasUpperCase: boolean,
    hasNonAlphaNumeric: boolean,
    hasNumeric: boolean,
    isValidPassword: boolean
}