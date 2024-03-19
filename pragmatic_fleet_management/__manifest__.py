# -*- coding: utf-8 -*-
{
    'name': "Pragmatic Fleet Management",

    'summary': "Pragmatic fleet management",

    'description': """
Long description of module's purpose
    """,

    'author': "My Company",
    'website': "https://www.yourcompany.com",

    # Categories can be used to filter modules in modules listing
    # Check https://github.com/odoo/odoo/blob/15.0/odoo/addons/base/data/ir_module_category_data.xml
    # for the full list
    'category': 'Uncategorized',
    'version': '0.1',

    # any module necessary for this one to work correctly
    'depends': ['base','hr','contacts', 'web', 'website', 'hr_attendance'],
    

    # always loaded
    'data': [
        # 'security/ir.model.access.csv',
        'security/security_groups.xml',
        'views/res_config_settings.xml',
        'views/hr_employees.xml',
        'views/map_view.xml',
        'views/user_map_view.xml',
        'views/google_places_template.xml',

        
    ],
        
    'assets': {
        'web.assets_frontend': [
            'pragmatic_fleet_management/static/src/js/selector_widget.js',
            'pragmatic_fleet_management/static/src/css/template_map.css',
            'https://cdn.jsdelivr.net/gh/habibmhamadi/multi-select-tag@2.0.1/dist/css/multi-select-tag.css',
            'https://cdn.jsdelivr.net/gh/habibmhamadi/multi-select-tag@2.0.1/dist/js/multi-select-tag.js',

        ],
        'web.assets_backend': [
            'pragmatic_fleet_management/static/src/scss/map_contents.scss',
            'pragmatic_fleet_management/static/src/js/map_view_script.js',
            'pragmatic_fleet_management/static/src/xml/template_map_view.xml',
            'pragmatic_fleet_management/static/src/css/google_map.css',
            'https://cdn.jsdelivr.net/gh/habibmhamadi/multi-select-tag@2.0.1/dist/css/multi-select-tag.css',
            'https://cdn.jsdelivr.net/gh/habibmhamadi/multi-select-tag@2.0.1/dist/js/multi-select-tag.js',            
        ],
    },
}

