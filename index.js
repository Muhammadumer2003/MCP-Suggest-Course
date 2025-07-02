const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
app.use(express.json());





// Serve the OpenAPI spec
app.get('/openapi.json', (req, res) => {
  const openapiPath = path.join(__dirname, 'public', 'openapi.json');
  const openapiSpec = fs.readFileSync(openapiPath, 'utf8');
  res.setHeader('Content-Type', 'application/json');
  res.send(openapiSpec);
});



//manifest file to be read by copilot studio
app.use('/api/.known', express.static(path.join(__dirname, 'public', '.known/ai-plugin.json')));



app.post('/suggestCourses', (req, res) => {

    //fetch user details
  const { major, interests, completedCourses } = req.body;
  

  const allCourses = [
    { code: "CS301", title: "Machine Learning", tags: ["AI"], prereqs: ["CS201"] },
    { code: "CS305", title: "Data Mining", tags: ["Data Science"], prereqs: ["CS201"] },
    { code: "CS310", title: "Networks", tags: ["Systems"], prereqs: ["CS102"] },
  ];

  const recommendations = allCourses
    .filter(course => 
      interests.some(interest => course.tags.includes(interest)) &&
      course.prereqs.every(prereq => completedCourses.includes(prereq))
    )
    .map(course => ({
      courseCode: course.code,
      title: course.title,
      reason: `Matches interests (${course.tags.join(", ")}) and prerequisites`
    }));

  res.json({ recommendations });
});

app.listen(process.env.Express_Port_no , () => console.log('MCP server running on port 3000'));

