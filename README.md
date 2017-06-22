## Description
This is a Beta example of Static Analysis to Generate the JSDoc from code. Tring to understand wich is the limit of AST 
to generate a JDoc (even on type analysis)

On **index.js** there is the main example, using the ASTParser lib and JSDocParser lib.

On **testEsprima.js** there are some random test to generate AST with Esprima.

In folder **astFile** there are the AST generated from file in **jsFile**


## Run It

This will run a simple append of JSdoc on file jsFile/function.js (Note it works only for simple function declaration,
on variable assing of function, it doesn't work)
```
npm install
node index.js
```



## Contributing
 
1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D
 
 
## Credits
 
Lead Developer - Enrico Aleandri (@enricoaleandri)
 
## License
 
The MIT License (MIT)

Copyright (c) 2017 Enrico Aleandri

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.