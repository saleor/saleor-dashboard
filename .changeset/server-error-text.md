---
"saleor-dashboard": patch
---

Error messages no longer show raw technical text when Saleor fails with a server error, when a proxy or firewall turns a request away, or when something other than Saleor answers, such as a Wi-Fi sign-in page. Loading data now says "Couldn't load some data" with "Saleor ran into a problem (error 500)", "The server refused the request (error 413)" or "The server sent an answer the dashboard can't read", and asks you to reload the page. A failed action says "Saleor ran into a problem (error 500)" or "Unexpected answer from the server" and asks you to check whether the change went through, or says "The server refused the request (error 413). The change wasn't saved." Previously these showed text such as "Unexpected token '<', "<!DOCTYPE"… is not valid JSON" or "Response not successful: Received status code 500". Errors Saleor explains itself are shown as before.
