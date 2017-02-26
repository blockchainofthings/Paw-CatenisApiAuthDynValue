/**
 * Created by claudio on 25/02/17.
 */

import crypto from 'crypto';
import url from 'url';
import moment from 'moment';

@registerDynamicValueClass
class CatenisApiAuthDynValue {

    static identifier = 'com.blockchainofthings.PawExtensions.CatenisApiAuthDynValue';
    static title = 'Catenis API Authentication';
    static inputs = [
        DynamicValueInput('deviceId', 'Device ID', "String", {persisted: true}),
        DynamicValueInput('apiAccessSecret', 'API Access Secret', "SecureValue", {persisted: true})
    ];

    evaluate(context) {
        return this.signRequest(context.getCurrentRequest());
    }

    title(context) {
        return 'Catenis API Authentication';
    }

    text(context) {
        return 'For device ' + this.deviceId;
    }

    signRequest(request) {
        const signVersionId = 'CTN1',
            signMethodId = 'CTN1-HMAC-SHA256',
            scopeRequest = 'ctn1_request',
            timestampHdr = 'X-BCoT-Timestamp';

        const now = moment();
        const timestamp = moment.utc(now).format('YYYYMMDDTHHmmss[Z]');
        const signDate = now.format('YYYYMMDD');

        const urlHostAndPath = CatenisApiAuthDynValue.getUrlHostAndPath(request.url);

        // First step: compute conformed request
        let confReq = request.method + '\n';
        confReq += urlHostAndPath.path + '\n';

        let essentialHeaders = 'host:' + urlHostAndPath.host + '\n';
        essentialHeaders += timestampHdr.toLowerCase() + ':' + request.getHeaderByName(timestampHdr) + '\n';

        confReq += essentialHeaders + '\n';
        confReq += CatenisApiAuthDynValue.hashData(request.body) + '\n';
        // DEBUG - Begin
        console.log('Conformed request: ' + confReq);
        // DEBUG - End

        // Second step: assemble string to sign
        let strToSign = signMethodId +'\n';
        strToSign += timestamp + '\n';

        const scope = signDate + '/' + scopeRequest;

        strToSign += scope + '\n';
        strToSign += CatenisApiAuthDynValue.hashData(confReq) + '\n';
        // DEBUG - Begin
        console.log('String to sign: ' + strToSign);
        // DEBUG - End

        // Third step: generate the signature
        const initKey = signVersionId + this.apiAccessSecret,
            dateKey = CatenisApiAuthDynValue.signData(signDate, initKey),
            signKey = CatenisApiAuthDynValue.signData(scopeRequest, dateKey),
            signature = CatenisApiAuthDynValue.signData(strToSign, signKey, true);
        // DEBUG - Begin
        console.log('Initialization key: ' + initKey);
        console.log('Date key: ' + dateKey.toString('hex'));
        console.log('Sign key: ' + signKey.toString('hex'));
        console.log('Signature: ' + signature);
        // DEBUG - End

        return signMethodId + ' Credential=' + this.deviceId + '/' + scope + ', Signature=' + signature;
    }

    static getUrlHostAndPath(fullUrl) {
        const parsedUrl = url.parse(fullUrl),
            schemeLength = parsedUrl.protocol.length + (parsedUrl.slashes ? 2 : 0);

        return {
            host: fullUrl.substr(schemeLength, parsedUrl.host.length),
            path: fullUrl.substr(schemeLength + parsedUrl.host.length)
        };
    }

    static hashData(data) {
        return crypto.createHash('sha256').update(data).digest('hex');
    }

    static signData(data, secret, hexEncode = false) {
        return crypto.createHmac('sha256', secret).update(data).digest(hexEncode ? 'hex' : undefined);
    }
}
