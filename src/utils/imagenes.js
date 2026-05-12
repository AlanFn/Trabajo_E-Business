function crearThumbnailDriveUrl(id) {
  return `https://drive.google.com/thumbnail?id=${encodeURIComponent(id)}&sz=w700`;
}

function extraerGoogleDriveId(url) {
  const fileMatch = url.match(/drive\.google\.com\/file\/d\/([^/?#]+)/i);

  if (fileMatch?.[1]) {
    return fileMatch[1];
  }

  try {
    const parsedUrl = new URL(url);

    if (parsedUrl.hostname !== "drive.google.com") {
      return "";
    }

    if (["/open", "/uc", "/thumbnail"].includes(parsedUrl.pathname)) {
      return parsedUrl.searchParams.get("id") || "";
    }
  } catch {
    const idMatch = url.match(/[?&]id=([^&#]+)/i);
    return idMatch?.[1] || "";
  }

  return "";
}

export function normalizarImagenUrl(url) {
  const urlLimpia = String(url || "").trim();

  if (!urlLimpia) {
    return "";
  }

  const thumbnailCorrecto = /^https:\/\/drive\.google\.com\/thumbnail\?id=[^&]+&sz=w\d+$/i;

  if (thumbnailCorrecto.test(urlLimpia)) {
    return urlLimpia;
  }

  const googleDriveId = extraerGoogleDriveId(urlLimpia);

  if (googleDriveId) {
    return crearThumbnailDriveUrl(googleDriveId);
  }

  return urlLimpia;
}
