/* eslint-disable */

const { request } = require("@playwright/test");
const dotenv = require("dotenv");
const process = require("process");
const crypto = require("crypto");
const path = require("path");
const fs = require("fs");

dotenv.config();

const algorithm = 'aes-256-ctr';

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

const ACCOUNT_EMAILS = {
  channel: "channel.manager@example.com",
  shipping: "shipping.manager@example.com",
  giftCard: "gift.card.manager@example.com",
  app: "app.manager@example.com",
  settings: "setting.manager@example.com",
  page: "page.manager@example.com",
  order: "order.manager@example.com",
  translations: "translation.manager@example.com",
  staff: "staff.manager@example.com",
  customer: "user.manager@example.com",
  productTypeAndAttribute: "product.type.and.attribute.manager@example.com",
  discount: "discount.manager@example.com",
  plugin: "plugin.manager@example.com",
  product: "product.manager@example.com",
};

const createQuery = (email, password) => {
  const query = `
    mutation TokenAuth($email: String!, $password: String!) {
      tokenCreate(email: $email, password: $password) {
        token
        refreshToken
        errors {
          code
          message
        }
        user {
          id
        }
      }
    }
  `

  const variables = { email, password }

  return { query, variables }
};


const getEmailForPermission = (permission) => {
  if (permission === "admin") {
    return process.env.E2E_USER_NAME;
  }

  return ACCOUNT_EMAILS[permission];
};

const getPasswordForPermission = (permission) => {
  if (permission === "admin") {
    return process.env.E2E_USER_PASSWORD;
  }

  return process.env.E2E_PERMISSIONS_USERS_PASSWORD;
};

const getAuthForPermission = async (permissionName) => {
  const apiRequestContext = await request.newContext({
    baseURL: process.env.BASE_URL,
  });

  const email = getEmailForPermission(permissionName);
  const password = getPasswordForPermission(permissionName);

  const response = await apiRequestContext.post(process.env.API_URL || "", {
    data: createQuery(email, password),
  });
  const resposnseObj = await response.json()
  const { errors } = resposnseObj.data.tokenCreate

  if (errors && errors.length > 0) {
    const errorMessages = errors
      .map(e => e.message)
      .join(", ");

    throw new Error(`Login failed for permission ${permissionName}: ${errorMessages}`);
  }

  const loginJsonInfo = await apiRequestContext.storageState();

  return loginJsonInfo
}

const encrypt = (password, text) => {
  const key = Buffer.concat([Buffer.from(password), Buffer.alloc(32)], 32);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + encrypted.toString('hex');
}

const decrypt = (password, text) => {
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

    process.stdout.write(encodedString)
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
      .map(JSON.parse)
      .map(obj => {
        obj.origins.push({
          origin: process.env.BASE_URL,
          localStorage: [
            {
              name: "_saleorRefreshToken",
              value: obj.cookies[0].value,
            },
          ],
        });

        return obj
      })
      .map(JSON.stringify)
      .map((str, index) => ({ name: PERMISSIONS[index], str }))
      .forEach(token => {
        const storageStatePath = path.join(tempDir, `${token.name}.json`); 
        fs.writeFileSync(storageStatePath, token.str);
      })
  }
})()