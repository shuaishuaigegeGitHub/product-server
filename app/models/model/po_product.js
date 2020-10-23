import dayjs from 'dayjs';

module.exports = function(sequelize, Sequelize) {
    let po_product = sequelize.define('po_product', {
        
        id: {
            type: Sequelize.INTEGER,
            comment: '',
            primaryKey: true, 
            autoIncrement: true, 
        },
        
        create_time: {
            type: Sequelize.STRING(30),
            comment: '创建时间',
            
            
        },
        
        update_time: {
            type: Sequelize.STRING(30),
            comment: '更新时间',
            
            
        },
        
        product_name: {
            type: Sequelize.STRING(255),
            comment: '产品名称',
            
            
        },
        
        month: {
            type: Sequelize.STRING(20),
            comment: '存储年月，按月份查询时使用',
            
            
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
        
        project_approval_user: {
            type: Sequelize.STRING(255),
            comment: '立项人',
            
            
        },
        
        poll: {
            type: Sequelize.INTEGER,
            comment: '票数',
            
            
        },
        
        provide_id: {
            type: Sequelize.INTEGER,
            comment: '提供者id',
            
            
        },
        
        provide_name: {
            type: Sequelize.STRING(50),
            comment: '提供者名称',
            
            
        },
        
        pool_id: {
            type: Sequelize.INTEGER,
            comment: '产品池id',
            
            
        },
        
        game_description: {
            type: Sequelize.STRING(255),
            comment: '游戏描述',
            
            
        },
        
        weight: {
            type: Sequelize.STRING(255),
            comment: '权重分布,json字符串',
            
            
        },
        
        user_group: {
            type: Sequelize.TEXT,
            comment: '用户群体',
            
            
        },
        
        age: {
            type: Sequelize.STRING(0),
            comment: '年龄范围',
            
            
        },
        
        gender: {
            type: Sequelize.INTEGER,
            comment: '用户性别',
            
            
        },
        
        game_difficulty: {
            type: Sequelize.TEXT,
            comment: '游戏难度',
            
            
        },
        
        interest: {
            type: Sequelize.TEXT,
            comment: '趣味性',
            
            
        },
        
        point_design: {
            type: Sequelize.TEXT,
            comment: '付费点设计',
            
            
        },
        
        original_name: {
            type: Sequelize.STRING(255),
            comment: '原著名称',
            
            
        },
        
        manufacturer_name: {
            type: Sequelize.STRING(255),
            comment: '厂家名称',
            
            
        },
        
        game_connection: {
            type: Sequelize.STRING(255),
            comment: '游戏主页连接',
            
            
        },
        
        achievement_description: {
            type: Sequelize.STRING(255),
            comment: '产品成就描述',
            
            
        },
        
        optimization: {
            type: Sequelize.STRING(255),
            comment: '优化方向',
            
            
        },
        
        analysis_conclusion: {
            type: Sequelize.TEXT,
            comment: '分析结论',
            
            
        },
        
        original_time: {
            type: Sequelize.STRING(50),
            comment: '原款产品发行时间',
            
            
        },
        
        original_remark: {
            type: Sequelize.STRING(255),
            comment: '原款游戏备注',
            
            
        },
        
        inspiration: {
            type: Sequelize.TEXT,
            comment: '灵感来源,描述',
            
            
        },
        
        status: {
            type: Sequelize.INTEGER,
            comment: '状态：1、未立项。2、已启动。3、已完成',
            
            
        },
        
        del: {
            type: Sequelize.INTEGER,
            comment: '是否作废：1、未作废。2已作废',
            
            
        },
        
        picture_quality: {
            type: Sequelize.INTEGER,
            comment: '画面品质：1、一般，2、高品质，',
            
            
        },
        
        handle_feeling: {
            type: Sequelize.INTEGER,
            comment: '操作手感：1.一般，2，重点还原',
            
            
        },
        
        reduction_degree: {
            type: Sequelize.INTEGER,
            comment: '还原度:1. 1:1,2.无需求，3.主玩法还原',
            
            
        },
        
        person: {
            type: Sequelize.STRING(255),
            comment: '录入者',
            
            
        },
        
        reason: {
            type: Sequelize.STRING(255),
            comment: '立项理由',
            
            
        },
        
        innovate_target: {
            type: Sequelize.STRING(255),
            comment: '创新目地',
            
            
        },
        
        innovate_synopsis: {
            type: Sequelize.STRING(255),
            comment: '创新点简介',
            
            
        },
        
    }, {
        underscored: true,
        tableName: 'po_product',
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
    return po_product;
};