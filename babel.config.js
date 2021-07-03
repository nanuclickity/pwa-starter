module.exports = function(api) {
  return {
    "presets": [
      [
        "@babel/preset-env", 
        { 
          "modules": false,
          "targets": api.caller(caller => caller && caller.target === 'node')
            ? { node: "current" }
            : { chrome: "90" }
        }
      ],
      "@babel/preset-react"
    ],
    "plugins": [
      "@babel/plugin-proposal-class-properties",
      "@babel/plugin-syntax-dynamic-import",
      "react-hot-loader/babel"
    ]
  }
}
