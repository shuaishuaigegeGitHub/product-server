import dayjs from 'dayjs';

module.exports = function (sequelize, Sequelize) {
    const product_base = sequelize.define('product_base', {

        base_id: {
            type: Sequelize.INTEGER,
            comment: '',
            primaryKey: true,
            autoIncrement: true,
        },

        product_id: {
            type: Sequelize.INTEGER,
            comment: '产品id',


        },

        priority: {
            type: Sequelize.INTEGER,
            comment: '优先级:1、重大。2、核心。3、一般，4、待定',


        },

        project_type: {
            type: Sequelize.INTEGER,
            comment: '项目体量：1、超轻度。2、轻度游戏。3、中度游戏。4、重度游戏',


        },

        technology_type: {
            type: Sequelize.INTEGER,
            comment: '技术选型：1、3D竖屏。2、3D横屏。3、2D竖屏。4、2D横屏',


        },

        game_type: {
            type: Sequelize.INTEGER,
            comment: '游戏类型',


        },

        theme: {
            type: Sequelize.STRING(255),
            comment: '游戏题材',


        },

        play_theme: {
            type: Sequelize.TEXT,
            comment: '玩法题材',


        },

        starting: {
            type: Sequelize.INTEGER,
            comment: '首发平台：1、微信。2、字节。3、OPPO。4、APP渠道。5、vivo',


        },

        source: {
            type: Sequelize.INTEGER,
            comment: '立项来源：1、直接立项。2、微创新。3、选品会。4、自主设计。',


        },

        poll: {
            type: Sequelize.INTEGER,
            comment: '票数',


        },
        project_selection: {
            type: Sequelize.INTEGER,
            comment: '立项来源为直接立项，立项人id',


        },

        pool_id: {
            type: Sequelize.INTEGER,
            comment: '游戏分组',


        },
        location: {
            type: Sequelize.INTEGER,
            comment: '产品定位：1 流量型，2 其他',


        },
        game_description: {
            type: Sequelize.STRING(255),
            comment: '游戏描述',


        },

        user_group: {
            type: Sequelize.STRING(255),
            comment: '产品分析。用户群体',


        },

        age: {
            type: Sequelize.STRING(255),
            comment: '产品分析。年龄范围',


        },

        gender: {
            type: Sequelize.INTEGER,
            comment: '产品分析。用户性别.男1，女2',


        },

        game_difficulty: {
            type: Sequelize.INTEGER,
            comment: '产品分析。游戏难度.1，无脑。2，简单。3，容易。4，适中。5，困难。6，偏难。7，超难。',


        },

        interest: {
            type: Sequelize.TEXT,
            comment: '产品分析。趣味性',


        },

        point_design: {
            type: Sequelize.TEXT,
            comment: '产品分析。付费点设计',


        },

        optimization: {
            type: Sequelize.STRING(255),
            comment: '产品分析。优化方向',


        },

        analysis_conclusion: {
            type: Sequelize.TEXT,
            comment: '产品分析。分析结论',


        },

        inspiration: {
            type: Sequelize.TEXT,
            comment: '灵感来源,描述',


        },

        weight_handle_feeling: {
            type: Sequelize.INTEGER,
            comment: '权重分部，操作手感',


        },

        weight_game_level: {
            type: Sequelize.INTEGER,
            comment: '权重分部,游戏关卡',


        },

        weight_art_action: {
            type: Sequelize.INTEGER,
            comment: '权重分部,美术动作',


        },

        weight_art_special: {
            type: Sequelize.INTEGER,
            comment: '权重分布,美术特效',


        },

        weight_sound_effect: {
            type: Sequelize.INTEGER,
            comment: '权重分布, 音乐音效',


        },

        weight_picture_quality: {
            type: Sequelize.INTEGER,
            comment: '权重分布,画面质量',


        },

        original_name: {
            type: Sequelize.STRING(255),
            comment: '原品数据，原著名称',


        },

        manufacturer_name: {
            type: Sequelize.STRING(255),
            comment: '原品数据，厂家名称',


        },

        game_connection: {
            type: Sequelize.STRING(255),
            comment: '原品数据，游戏主页连接',


        },

        original_time: {
            type: Sequelize.STRING(255),
            comment: '原品数据，原款产品发行时间',


        },

        achievement_description: {
            type: Sequelize.TEXT,
            comment: '原品数据，产品成就描述',


        },

        original_remark: {
            type: Sequelize.TEXT,
            comment: '原品数据，原款游戏备注',


        },

    }, {
        underscored: true,
        tableName: 'product_base',
        timestamps: false,
    });
    return product_base;
};