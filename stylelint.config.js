module.exports = {
  defaultSeverity: 'error',
  extends: ['stylelint-config-sass-guidelines'],
  plugins: ['stylelint-scss', 'stylelint-order'],
  rules: {
    // 不要使用已被 autoprefixer 支持的浏览器前缀
    'media-feature-name-no-vendor-prefix': true,
    'at-rule-no-vendor-prefix': true,
    'selector-no-vendor-prefix': true,
    'property-no-vendor-prefix': true,
    'value-no-vendor-prefix': true,
    // 最多允许嵌套20层，去掉默认的最多2层
    'max-nesting-depth': 20,
    // 颜色值要大写
    'color-hex-case': 'upper',
    'declaration-property-value-disallowed-list': {

    },
    'selector-max-id': 2,
    'string-quotes': 'double',
  },
}
