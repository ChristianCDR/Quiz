export function emailValidator (email: string, confirmEmail: string) {
    const reg = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,6}$/ 
    if (email === confirmEmail) {
        return reg.test(email)
    }
    else return ('mail_mismatch')
}

export function userNameValidator (userName: string) {
    const reg = /^[\w\s\-]{1,30}$/ 
    return reg.test(userName)
}

export function passwordValidator (password: string) {
    const reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[a-zA-Z\d@$!%*?&]{8,}$/ 
    return reg.test(password)
}
