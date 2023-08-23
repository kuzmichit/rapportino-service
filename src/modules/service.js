const promise = new Promise((resolve, reject) => {
  resolve('ok');
} )

const _baseURL = 'https://la-sceda-di-lavoro-default-rtdb.firebaseio.com';
const _pathToResource = 'rapportinoBorys';
const _URL = _baseURL + _pathToResource;


// "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjYzODBlZjEyZjk1ZjkxNmNhZDdhNGNlMzg4ZDJjMmMzYzIzMDJmZGUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vbGEtc2NlZGEtZGktbGF2b3JvIiwiYXVkIjoibGEtc2NlZGEtZGktbGF2b3JvIiwiYXV0aF90aW1lIjoxNjkyMzM1ODM1LCJ1c2VyX2lkIjoibU0wOVRTbHlEbWI4RVZ4ZEx0OGJKOXlsQzF5MSIsInN1YiI6Im1NMDlUU2x5RG1iOEVWeGRMdDhiSjl5bEMxeTEiLCJpYXQiOjE2OTIzMzU4MzUsImV4cCI6MTY5MjMzOTQzNSwiZW1haWwiOiJ6dWNjYUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsienVjY2FAZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoicGFzc3dvcmQifX0.Iq0lX0vX0ymcKHAQmYySCSr6noCInprdVVg73yjpP1ZXmd5WyqJsTQtACMWt4R-qwzDzz7zGSRjgAGazo4K-lFBz9UP9xsup_IzWCR7uoHrd8qR11kMYCB93uoopFaeiaMilHUpg4_5U4Kcm67JDmRf3nqV8dbSbkYy-LWrKhCSg8Vx-cM5iC_oDosdCuVSMey1BKHKtvyuAsoO261DmQS6BgoyJVOmkRMqDRO9UW-z42pVuogMPMIRAlXqjWxMBoR9bRNxuEM28vxZsIrXmcswLtv06PHpbp-IvNRqOIkcOz4S7n4acA8s_nZyzvK3UBLP4b1NKAy52mYfwfUt2tw",

"idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjYzODBlZjEyZjk1ZjkxNmNhZDdhNGNlMzg4ZDJjMmMzYzIzMDJmZGUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vbGEtc2NlZGEtZGktbGF2b3JvIiwiYXVkIjoibGEtc2NlZGEtZGktbGF2b3JvIiwiYXV0aF90aW1lIjoxNjkyMzM2MDA3LCJ1c2VyX2lkIjoibU0wOVRTbHlEbWI4RVZ4ZEx0OGJKOXlsQzF5MSIsInN1YiI6Im1NMDlUU2x5RG1iOEVWeGRMdDhiSjl5bEMxeTEiLCJpYXQiOjE2OTIzMzYwMDcsImV4cCI6MTY5MjMzOTYwNywiZW1haWwiOiJ6dWNjYUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsienVjY2FAZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoicGFzc3dvcmQifX0.Vu7fi57c8yC0X-1Kk3zJTZmzbi98vzFFA80iT_chNMD_9zSJd3hahMzivueMYhqLaDlEVHCZIbeBRTTCa22uLCl_zXZOz5aoYheR-WIlmJpZzQi8-MohUNfZMDOGEzOGlMTchBHfn4Uhne9kTm4-GQK_rboHHKDqdR3Axv7UPcVnjp_GIvhV00C8DMGYgiwrsZBS-rd_jl8mTqYq_obCf0YdiwQTiJ8Z5NaqPwQaQ2mSyfhzPlLzYQOdydua7LnvfZLVSEmQqKCxHNzDMjgsFdktkD46jXoA0y-FZuFItlnKuNCA1TSaPSVY7oKTjs0PA-CqJME1FHOcyXqzEfus6g",


const getResourceFromDatabase = async (url = _URL, method = 'GET', body = null, headers = {'Content-Type': 'application/json'} ) => {

  try {
    const response = await fetch(url, {method, body, headers} );

    if (!response) {
      //throw new Error(`Could not fetch ${url}, status: ${response.status}`);
    }

    const data = await response.json();
    
    return data;
  }
  catch(e) {
    alert(e)
  }
};
