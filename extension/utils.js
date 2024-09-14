function fetchTranscript() {
  /* Fetch the transcript of the video */

  return fetch(
    "https://www.youtube.com/youtubei/v1/get_transcript?prettyPrint=false",
    {
      headers: {
        accept: "*/*",
        "accept-language": "en-US,en;q=0.9",
        authorization:
          "SAPISIDHASH 1726350752_6adbd03915bcedb62c77728405c797521b6041f4_u",
        "cache-control": "no-cache",
        "content-type": "application/json",
        pragma: "no-cache",
        priority: "u=1, i",
        "sec-ch-ua": '"Not;A=Brand";v="24", "Chromium";v="128"',
        "sec-ch-ua-arch": '"arm"',
        "sec-ch-ua-bitness": '"64"',
        "sec-ch-ua-form-factors": '"Desktop"',
        "sec-ch-ua-full-version": '"128.0.6613.138"',
        "sec-ch-ua-full-version-list":
          '"Not;A=Brand";v="24.0.0.0", "Chromium";v="128.0.6613.138"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-model": '""',
        "sec-ch-ua-platform": '"macOS"',
        "sec-ch-ua-platform-version": '"14.5.0"',
        "sec-ch-ua-wow64": "?0",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "same-origin",
        "sec-fetch-site": "same-origin",
        "x-client-data": "CNWKywE=",
        "x-goog-authuser": "0",
        "x-goog-visitor-id": "CgtET0VheVZJWXRvUSi8iZi3BjIKCgJDQRIEGgAgQQ%3D%3D",
        "x-origin": "https://www.youtube.com",
        "x-youtube-bootstrap-logged-in": "true",
        "x-youtube-client-name": "1",
        "x-youtube-client-version": "2.20240913.01.00",
      },
      referrer: "https://www.youtube.com/watch?v=MAZyQ-38b8M",
      referrerPolicy: "origin-when-cross-origin",
      body: '{"context":{"client":{"hl":"en","gl":"CA","remoteHost":"2620:101:f000:7c2:0:0:0:c027","deviceMake":"Apple","deviceModel":"","visitorData":"CgtET0VheVZJWXRvUSi8iZi3BjIKCgJDQRIEGgAgQQ%3D%3D","userAgent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36,gzip(gfe)","clientName":"WEB","clientVersion":"2.20240913.01.00","osName":"Macintosh","osVersion":"10_15_7","originalUrl":"https://www.youtube.com/watch?v=5rFzKdAdpOg","screenPixelDensity":2,"platform":"DESKTOP","clientFormFactor":"UNKNOWN_FORM_FACTOR","configInfo":{"appInstallData":"CLyJmLcGEMn3rwUQ6-j-EhDN17AFEL2ZsAUQppqwBRCinbEFEMfmsAUQt--vBRCJp7EFEOrDrwUQyL-xBRCU_K8FEOPRsAUQj8OxBRComrAFEJ3QsAUQ3q2xBRDbr68FEMX1sAUQsM6xBRC36v4SEO_HsQUQ7KixBRCHw7EFEPSrsAUQppOxBRCizf8SEKaSsQUQ3ej-EhD4ubEFEJO2sQUQlImxBRDlubEFEJ7GsQUQiIewBRCWlbAFEMnXsAUQvL6xBRDpzLEFENGvsQUQqtiwBRCuwbEFEJrOsQUQooGwBRCdprAFEJmYsQUQiqGxBRC9irAFEIHDsQUQ5cqwBRDvzbAFEL22rgUQn9OwBRDTxLEFEOK1sQUQxqSxBRCw7rAFEOuZsQUQ2cmvBRDuubEFEMzfrgUQ0-GvBRCNlLEFEIHGsAUQ0I2wBRCSy7EFEIXDsQUQlP6wBRDf7bAFEPTAsQUQjcywBRCI468FENbdsAUQlqOxBRCFp7EFEOHssAUQ4tSuBRD4q7EFENfprwUQ276xBRCSrrEFEMnmsAUQieiuBRDzx7EFEParsAUQqJKxBRDuoq8FEIS2sAUQxc6xBRDXurEFEPnI_xIqIENBTVNFaFVKb0wyd0ROSGtCdlB0OFF2UDFBNGRCdz09"},"screenDensityFloat":2,"userInterfaceTheme":"USER_INTERFACE_THEME_DARK","timeZone":"America/Toronto","browserName":"Chrome","browserVersion":"128.0.0.0","acceptHeader":"text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7","deviceExperimentId":"ChxOelF4TkRZeE9UQTBOREV3TnpRd05qWTJPUT09ELyJmLcGGLyJmLcG","screenWidthPoints":892,"screenHeightPoints":1048,"utcOffsetMinutes":-240,"connectionType":"CONN_CELLULAR_4G","memoryTotalKbytes":"8000000","mainAppWebInfo":{"graftUrl":"https://www.youtube.com/watch?v=MAZyQ-38b8M","pwaInstallabilityStatus":"PWA_INSTALLABILITY_STATUS_CAN_BE_INSTALLED","webDisplayMode":"WEB_DISPLAY_MODE_BROWSER","isWebNativeShareAvailable":true}},"user":{"lockedSafetyMode":false},"request":{"useSsl":true,"internalExperimentFlags":[],"consistencyTokenJars":[]},"clickTracking":{"clickTrackingParams":"CBcQ040EGAYiEwiKrJHItcOIAxXKhf8EHbi9AmA="},"adSignalsInfo":{"params":[{"key":"dt","value":"1726350526524"},{"key":"flash","value":"0"},{"key":"frm","value":"0"},{"key":"u_tz","value":"-240"},{"key":"u_his","value":"2"},{"key":"u_h","value":"1107"},{"key":"u_w","value":"1710"},{"key":"u_ah","value":"1068"},{"key":"u_aw","value":"1710"},{"key":"u_cd","value":"30"},{"key":"bc","value":"31"},{"key":"bih","value":"1048"},{"key":"biw","value":"892"},{"key":"brdim","value":"0,39,0,39,1710,39,1710,1068,892,1048"},{"key":"vis","value":"1"},{"key":"wgl","value":"true"},{"key":"ca_type","value":"image"}]}},"params":"CgtNQVp5US0zOGI4TRISQ2dOaGMzSVNBbVZ1R2dBJTNEGAEqM2VuZ2FnZW1lbnQtcGFuZWwtc2VhcmNoYWJsZS10cmFuc2NyaXB0LXNlYXJjaC1wYW5lbDAAOAFAAQ%3D%3D"}',
      method: "POST",
      mode: "cors",
      credentials: "include",
    }
  ).then((response) => response.json());
}

function addContainer() {
  /* Add a container to the sidebar for the avatar */

  avatarContainer = document.createElement("div");
  avatarContainer.id = "avatar-container";

  avatar = document.createElement("canvas");
  avatar.id = "avatar";
  avatarContainer.appendChild(avatar);

  const targetElement = document.getElementById("secondary-inner");
  if (targetElement) {
    targetElement.insertBefore(avatarContainer, targetElement.firstChild);
  }
}

function getCurrentTime() {
  /* Get current time of the video player */

  const player = document.querySelector("video");
  if (player) {
    return player.currentTime;
  }
  return 0;
}
