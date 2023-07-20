const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const CLIENT_ID ="847630705574-qmaucbjelq82bpsjm38qtbe8gf38uc4b.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN ="1//043X90D25WaUdCgYIARAAGAQSNwF-L9IrizlJ8okYYPEcPVNG472o8sep4VIkudTi-YBiQ-GPMn36BTmFyvVATiQDgHDj5lRXmdk";

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

async function sendMail() {
  try {
    const accessToken = await oAuth2Client.getAccessToken();
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "proyectoreservas1@gmail.com",
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    const mailOptions = {
      from: "proyecto Reservas <proyectoreservas1@gmail.com>",
      to: "mezajonas747@gmail.com",
      subject: "Hello from gmail using API",
      text: "Hello from gmail email using API",
      html: "<h1>Hello from gmail email using API</h1>",
    };

    const result = await transport.sendMail(mailOptions);
    return result;
  } catch (error) {
    return error;
  }
}

// sendMail()
//   .then((result) => console.log("Email enviado...", result))
//   .catch((error) => console.log(error.message));


async function readEmails() {
    try {
      //const accessToken = await oAuth2Client.getAccessToken();
  

      const gmailClient = google.gmail({ version: "v1", auth: oAuth2Client });
  

      const response = await gmailClient.users.messages.list({
        userId: "me",
        labelIds: "INBOX",
        maxResults: 1,
      });
  

      const messages = response.data.messages;
      if (!messages) {
        console.log("No hay mensajes en la bandeja de entrada.");
        return;
      }
  

      for (const message of messages) {
        const messageResponse = await gmailClient.users.messages.get({
          userId: "me",
          id: message.id,
        });
        const email = messageResponse.data;
        const subject = email.payload.headers.find(header => header.name === "Subject")?.value || "(Sin asunto)";
        const from = email.payload.headers.find(header => header.name === "From")?.value || "(Sin remitente)";
  
        console.log("Asunto:", subject);
        console.log("De:", from);
  
        if (email.payload.parts) {

          const bodyData = email.payload.parts[0]?.body?.data;
          if (bodyData) {
            const decodedBody = Buffer.from(bodyData, "base64").toString();
            console.log("Cuerpo:", decodedBody);
          } else {
            console.log("Cuerpo: (Sin cuerpo legible)");
          }
        } else {
          console.log("Cuerpo: (Sin cuerpo legible)");
        }
  
        console.log("-----------------------------------------");
      }
    } catch (error) {
      console.error("Error al leer correos electrónicos:", error.message);
    }
  }
  
  readEmails();
  