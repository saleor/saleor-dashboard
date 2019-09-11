import LoginPage from '../Models/loginPageModel';
import HomePage from '../Models/homePageModel';

const loginPage = new LoginPage();
const homePage = new HomePage();
export const mainPageURL = loginPage.mainPageURL;

const USER_EMAIL = 'admin@example.com';
const USER_PASSWORD = 'admin';

export function verifyEmailAndPasswordDisplayed(){
    test('Verify that Email and Password are displayed', async t =>{
        await t.expect(loginPage.email.exists).ok();
        await t.expect(loginPage.password.exists).ok();
    })
}

export function verifyIfUserCanLogin(){
    test.only('PerformLogin', async t =>{
        await loginPage.performLogin(USER_EMAIL, USER_PASSWORD);
        await t.expect(homePage.header.exists).ok();
    } )
}
