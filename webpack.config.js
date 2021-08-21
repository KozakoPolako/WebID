const path = require("path");
const { experiments } = require("webpack");



module.exports = {
    entry: './WebID_Client/src/js/app.js',
    output: {
        filename: "bundle.min.js",
        path: path.resolve(__dirname, "./WebID_Client/dist/js")
    },
    watch: false,
    mode: 'production',
    devtool: "source-map",
    
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            [
                                "@babel/preset-env",
                                // {
                                //   "useBuiltIns": "usage", // alternative mode: "entry"
                                //   "corejs": 3, // default would be 2
                                //   "targets": "> 0.25%, not dead" 
                                //   // set your own target environment here (see Browserslist)
                                // }
                            ]
                        ]
                        
                    }
                }
            }
        ]
    }
    
}