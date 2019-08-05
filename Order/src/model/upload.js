import COS from 'cos-js-sdk-v5';
import * as api from '../api';
import * as config from '../config';

export default function upload(option) {
  const cos = getCos();
  const fileName = getNewFileName(option.file.name);

  cos.putObject({
    Bucket: config.COS_BUCKET,
    Region: config.COS_REGION,
    Key: `${config.PULISH_TASK_DIR}/${fileName}`,
    Body: option.file,
  }, (err, data) => {
    if (!err && data) {
      const url = `${config.COS_URL}/${config.PULISH_TASK_DIR}/${fileName}`;
      option.onSuccess({
        imgURL: url,
        downloadURL: url,
      });
    } else {
      option.onError({
        err,
      });
    }
  });
  return {
    abort() {
      cos.cancelTask();
    },
  };
}

function getNewFileName(old) {
  const index = old.lastIndexOf('.');
  return `${Date.now()}${old.substr(index)}`;
}

let cos = null;

function getCos() {
  if (cos) {
    return cos;
  }
  // 初始化实例
  cos = new COS({
    getAuthorization: (options, callback) => {
      api.getSecrectKey().then((res) => {
        callback({
          TmpSecretId: res.tmp_secret_id,
          TmpSecretKey: res.tmp_secret_key,
          XCosSecurityToken: res.token,
          ExpiredTime: res.refresh_interval,
        });
      }).catch((e) => {
        console.error(e);
      });
    },
  });
  return cos;
}