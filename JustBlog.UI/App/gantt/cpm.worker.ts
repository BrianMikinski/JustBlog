
/**
 * testing web workers in webpack
 */
const cpmWorkerCtx: Worker = self as any;

cpmWorkerCtx.onmessage = e => {
    const message = e.data;
    console.log(`[From Main]: ${message}`);

    cpmWorkerCtx.postMessage("cpm calculated");
};