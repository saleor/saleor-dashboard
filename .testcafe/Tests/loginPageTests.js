import * as verifier from '../Verifications/loginPageVerifications';

fixture `Login Tests`
    .page(verifier.mainPageURL);

    verifier.verifyEmailAndPasswordDisplayed();
    verifier.verifyIfUserCanLogin();