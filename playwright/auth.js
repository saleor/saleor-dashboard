/* eslint-disable */

const { request }  = require("@playwright/test");
const dotenv = require("dotenv");
const process = require("process");
const crypto = require("crypto");
const path = require("path");
const fs = require("fs");

dotenv.config();

const PERMISSIONS = [
  "admin",
  "app",
  "discount",
  "order",
  "channel",
  "customer",
  "giftCard",
  "page",
  "plugin",
  "productTypeAndAttribute",
  "product",
  "settings",
  "staff",
  "shipping",
  "translations",
]

const createQuery = (email, password) => `mutation TokenAuth{
  tokenCreate(email: "${email}", password: "${password}") {
    token
    refreshToken
    errors: errors {
      code
      message
    }
    user {
      id
    }
  }
}`;


const getEmailForPermission = (permission) => {
  if (permission === "admin") {
    return process.env.E2E_USER_NAME;
  } else {
    return USER_PERMISSION[permission];
  }
};

const getPasswordForPermission = (permission) => {
  if (permission === "admin") {
    return process.env.E2E_USER_PASSWORD;
  } else {
    return process.env.E2E_PERMISSIONS_USERS_PASSWORD;
  }
};

const getAuthForPermission = async (permissionName) => {
  const apiRequestContext = await request.newContext({
    baseURL: process.env.BASE_URL,
  });

  const email = getEmailForPermission("admin");
  const password = getPasswordForPermission("admin");
  const query = createQuery(email, password)

  await apiRequestContext.post(process.env.API_URL || "", {
    data: { query },
  });

  const loginJsonInfo = await apiRequestContext.storageState();

  loginJsonInfo.origins.push({
    origin: process.env.BASE_URL,
    localStorage: [
      {
        name: "_saleorRefreshToken",
        value: loginJsonInfo.cookies[0].value,
      },
    ],
  });

  return loginJsonInfo
}

const encrypt = (password, text) => {
  const algorithm = 'aes-256-ctr';
  const key = Buffer.concat([Buffer.from(password), Buffer.alloc(32)], 32);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + encrypted.toString('hex');
}

const decrypt = (password, text) => {
  const algorithm = 'aes-256-ctr';
  const key = Buffer.concat([Buffer.from(password), Buffer.alloc(32)], 32);
  const iv = Buffer.from(text.substring(0, 32), 'hex');
  const encryptedText = Buffer.from(text.substring(32), 'hex');
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

(async () => {
  const command = process.argv[2]

  if (command == "login") {
    let authString = ''

    for (const permissionName of PERMISSIONS) {
     const auth = await getAuthForPermission(permissionName)

     authString = `${authString}${JSON.stringify(auth)}|`
    }

    const encodedString = encrypt(process.env.E2E_ENCODE_PASS, authString)

    console.log(encodedString)
  }


  if (command == "restore") {
    const tempDir = path.join(__dirname, "../playwright/.auth");
  
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }


    const encodedInput = process.argv[3]
    console.log("Restoring...", encodedInput.length)


    const decodedString = decrypt(process.env.E2E_ENCODE_PASS, encodedInput)
    decodedString
      .split("|")
      .filter(Boolean)
      .map((str, index) => ({ name: PERMISSIONS[index], str }))
      .forEach(token => {
        const storageStatePath = path.join(tempDir, `${token.name}.json`); 
        fs.writeFileSync(storageStatePath, token.str);
      })
  }
})()

