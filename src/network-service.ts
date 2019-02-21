import { injectable } from "inversify";
import * as request from "request";

@injectable()
export class NetworkService {
  downloadFile(uriToDownload: string, stream: NodeJS.WritableStream): Thenable<boolean> {
    return new Promise((resolve, reject) => {
      request
        .get(uriToDownload, { timeout: 4000 })
        .on("response", function(response: any) {
          if (response.statusCode === 200) {
            resolve(true);
          } else {
            reject(`Failed to download file: ${response.statusMessage}`);
          }
        })
        .on("error", function(e: any) {
          reject(`Failed to download file: ${e}`);
        })
        .pipe(stream);
    });
  }
}
