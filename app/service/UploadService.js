import * as UploadUtil from '@app/util/uploadUtil';
import GlobalError from '@app/common/GlobalError';
import { INVALID_PARAM_ERROR_CODE } from '@app/constants/ResponseCode';

/**
 * 上传logo图片
 * @param {object} file 上传的图片
 */
export const uploadLogo = async (file) => {
    if (!file) {
        throw new GlobalError(INVALID_PARAM_ERROR_CODE, '请上传图片');
    }
    let filename = UploadUtil.uploadLogo(file);
    return filename;
};