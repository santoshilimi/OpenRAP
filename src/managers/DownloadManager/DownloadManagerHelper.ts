/**
 * @author Harish Kumar Gangula <harishg@ilimi.in>
 */
const { SuDScheduler } = require('su-downloader3')
import { Singleton } from 'typescript-ioc';
import * as _ from 'lodash';

@Singleton
export class DownloadManagerHelper {

    private suDScheduler;
    constructor() {
        // initialize the su downloader3 schedular
        let options = {
            threads: 4,
            throttleRate: 5000
        }

        let schedulerOptions = {
            autoStart: true,
            maxConcurrentDownloads: 1, //  don't change this which will give db duplicate update errors on progress
            downloadOptions: options
        }
        this.suDScheduler = new SuDScheduler(schedulerOptions)
    }

    queueDownload = (downloadId: string, pluginId: string, locations: object, observer: any): boolean => {
        return this.suDScheduler.queueDownload(downloadId, locations, observer);
    }

    pause = (downloadId: string): boolean => {
        return this.suDScheduler.pauseDownload(downloadId);

    };

    cancel = (downloadId: string): boolean => {
        return this.suDScheduler.killDownload(downloadId);
    };

    pauseAll = (): void => {
        this.suDScheduler.pauseAll();
    };

    cancelAll = (): boolean => {
        let flag = false;
        if (!_.isEmpty(this.suDScheduler.taskQueue)) {
            _.forEach(this.suDScheduler.taskQueue, (task) => {
                flag = this.suDScheduler.killDownload(task.key);
            })
        }
        return false;
    };

    taskQueue = () => {
        return this.suDScheduler.taskQueue;
    }

}

