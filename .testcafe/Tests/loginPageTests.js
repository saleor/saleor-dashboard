import * as verifier from "../Verifications/loginPageVerifications";
import { MAIN_PAGE_URL } from "../Data/systemData";

fixture`Login Tests`.page(MAIN_PAGE_URL);

verifier.verifyEmailAndPasswordDisplayed();
verifier.verifyIfUserCanLogin();
