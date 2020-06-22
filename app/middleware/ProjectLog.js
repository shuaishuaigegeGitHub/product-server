import models from '@app/models/index';

// 项目动态日志记录
export default (options = {}) => {
    let { describe, contentColumnName, projectIdColumnName = 'id', action = 'UPDATE' } = options;
    return async (ctx, next) => {
        let body = ctx.request.body;
        let projectId = ctx.request.body[projectIdColumnName] || ctx.params[projectIdColumnName] || ctx.query[projectIdColumnName];
        await next();
        let username = ctx.state.userName;
        let content = body[contentColumnName] || '';
        if (action === 'ADD') {
            // 项目新增操作
            projectId = ctx.body.data.id;
        } else if (action === 'ADD_PARTNER') {
            // 项目添加参与者
            let userList = body.map(item => item.username);
            content = userList;
            projectId = body[0].project_id;
        }
        if (content instanceof Array) {
            // 如果是数组则用，分割
            content = content.join(',');
        }
        let data = {
            project_id: projectId,
            operator: username,
            detail: describe || '',
            content,
            column_name: contentColumnName
        };
        models.project_log.create(data);
    };
}
