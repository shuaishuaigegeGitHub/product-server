import dayjs from 'dayjs';

module.exports = function(sequelize, Sequelize) {
    const product_conclusion = sequelize.define('product_conclusion', {

        id: {
            type: Sequelize.INTEGER,
            comment: '总结ID',
            primaryKey: true,
            autoIncrement: true,
        },

        product_id: {
            type: Sequelize.INTEGER,
            comment: '产品Id',


        },

        seven_days_data: {
            type: Sequelize.TEXT,
            comment: '上线七天数据seven_days_data：[{date：日期，week：星期，DAU：DAU, save: 留存,  time: 在线时长/秒}]',


        },

        product_result: {
            type: Sequelize.TINYINT(1),
            comment: '项目结果【1.成功  2.失败】',


        },

        market_feedback: {
            type: Sequelize.TEXT,
            comment: '市场反馈',


        },

        demo_status: {
            type: Sequelize.STRING(200),
            comment: 'demo版状态demo_status：  【 延迟  {whether_delay: 2, head_person: 主要负责人, reason: 理由}   正常  {whether_delay: 1}]】',


        },

        experience_status: {
            type: Sequelize.STRING(200),
            comment: '体验版状态experience_status：   【 延迟  {whether_delay: 2, head_person: 主要负责人, reason: 理由}  正常  {whether_delay: 1} 】',


        },

        transfer_operation_status: {
            type: Sequelize.STRING(200),
            comment: '移交运营状态experience_status：   【 延迟  {whether_delay: 2, head_person: 主要负责人, reason: 理由}   正常  {whether_delay: 1} 】',


        },

        question_feedback: {
            type: Sequelize.TEXT,
            comment: '问题反馈 question_feedback： [{question：遇到的问题，plan：解决方案}]',


        },

        result_show: {
            type: Sequelize.STRING(255),
            comment: '项目成果展示',


        },

        new_breakthrough: {
            type: Sequelize.STRING(200),
            comment: '新的突破',


        },

        reflection_conclusion: {
            type: Sequelize.STRING(200),
            comment: '项目反思/总结 (可以从研发技术、运营方案等方面展开叙述）',


        },

        product_extension: {
            type: Sequelize.STRING(200),
            comment: '微创新思路或者其它方向的猜测（产品延伸）等',


        },

        product_meeting: {
            type: Sequelize.STRING(255),
            comment: '项目总结会',


        },

        program_code: {
            type: Sequelize.STRING(255),
            comment: '程序代码提交    program_code:【 已提交  {whether_commit: 1, adress_file: 文件地址}   未提交  {whether_commit: 1}]】',


        },

        behind_upload: {
            type: Sequelize.STRING(255),
            comment: '策划案上传共享盘   behind_upload:【 已提交  {whether_commit: 1, adress_file: 文件地址}   未提交  {whether_commit: 1}]】',


        },

        art_upload: {
            type: Sequelize.STRING(255),
            comment: '美术相关文件上传共享盘   art_upload:【 已提交  {whether_commit: 1, adress_file: 文件地址}   未提交  {whether_commit: 1}]】',


        },

    }, {
        underscored: true,
        tableName: 'product_conclusion',
        createdAt: 'create_time',
        updatedAt: 'update_time',
        timestamps: false,
        hooks: {
            beforeCreate: (instance, options) => {
                instance.create_time = dayjs().unix();
            },
            beforeUpdate: (instance, options) => {
                instance.update_time = dayjs().unix();
            }
        }
    });
    return product_conclusion;
};