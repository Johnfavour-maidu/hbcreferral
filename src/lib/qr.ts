import QRCode from "qrcode";

export async function generateQRCode(text: string): Promise<string> {
  const dataUrl = await QRCode.toDataURL(text, {
    width: 400,
    margin: 2,
    color: {
      dark: "#5B2D90",
      light: "#FFF8EF",
    },
  });
  return dataUrl;
}

export async function generateQRSVG(text: string): Promise<string> {
  return QRCode.toString(text, {
    type: "svg",
    width: 400,
    margin: 2,
    color: {
      dark: "#5B2D90",
      light: "#FFF8EF",
    },
  });
}

export async function generateQRBuffer(text: string): Promise<Buffer> {
  return QRCode.toBuffer(text, {
    width: 400,
    margin: 2,
    color: {
      dark: "#5B2D90",
      light: "#FFF8EF",
    },
  });
}
