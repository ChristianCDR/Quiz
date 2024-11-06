export function emailValidator (email: string) {
    const reg = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,6}$/ 
    return reg.test(email)    
}

export function usernameValidator (userName: string) {
    const reg = /^[\w\s\-]{1,30}$/ 
    return reg.test(userName)
}

export function passwordValidator (password: string) {
    const reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[a-zA-Z\d@$!%*?&]{8,}$/ 
    return reg.test(password)
}
