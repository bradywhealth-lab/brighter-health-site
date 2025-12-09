exports.handler = async function(event, context) {
  console.log("[Function] get-contact-info invoked");
  
  return {
    statusCode: 200,
    body: JSON.stringify({
      name: "Brady Wilson",
      company: "Brighter Health Solutions LLC",
      phone: ["(239) 310-8926", "(970) 306-5173"],
      email: ["bradyw.health@gmail.com", "brighterhealthsolutions@gmail.com"],
      social: {
        instagram: "@healthwithbrady",
        facebook: "Brighter Health Solutions"
      }
    }),
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    }
  };
};
