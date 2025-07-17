// utils/Validator.js

const defaultCodeSnippets = {
  JavaScript: `console.log("Hello, JavaScript!");`,
  Python: `print("Hello, Python!")`,
  Java: `public class Main { public static void main(String[] args) { System.out.println("Hello, Java!"); } }`,
  "C++": `#include <iostream>\nusing namespace std;\nint main() { cout << "Hello, C++!"; return 0; }`,
  C: `#include <stdio.h>\nint main() { printf("Hello, C!"); return 0; }`,
  Go: `package main\nimport "fmt"\nfunc main() { fmt.Println("Hello, Go!") }`,
  Bash: `echo "Hello, Bash!"`,
};

module.exports = defaultCodeSnippets;


