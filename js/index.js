var width = window.innerWidth, 
    height = window.innerHeight;
    currentNode = null,
    currentLink = null,
    index=0,
    scale = 1,
    aux=0,
    timer=10,
    animationTime=5000,
    root_json="graph",
    path_json ="js/json/",
    pastJson=null,
    pathRemote = null,
    lineWidth=1.5,
    currentLevel = 0,
    nNodes = 0,
    maximumNodeSize=50,
    force = force = d3.layout.force()
    .size([width, height])
    .charge(-300)
    .linkDistance(40)
    .on("tick",tick);
    update=setInterval(updateData, timer*1000),
    tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  // Label for mouse overs node
  .html(function(d) {
    return "<strong>ID:</strong> <span style='color:red'>" + d.index + 
            "</span><br/>Number of Nodes:<span style='color:red'id='" + d.index +"'> " + 
            svg.select("#node"+d.index).attr("numberOfNodes")+ "</span>";
  }),
    drag =force.drag(), 
    svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .call(d3.behavior.zoom().on("zoom", redraw))
    .on("dblclick.zoom", null)
    .append('g'),
      drag = force.stop().drag()
.on("dragstart", function(d) {
    d3.event.sourceEvent.stopPropagation();
    }),  
    loading=null,

    link = svg.selectAll(".link"),
    node = svg.selectAll(".node"),
    levels = {level0: name};
load(); 
svg.call(tip);
console.log(document.getElementsByTagName("g"));
function loadGraph(path){
     // adding the values that are defalut in the text field
    document.getElementById('timer').value = timer;
    
    // creating the pathway based in the current level
   	current_path = "";
   	if (currentLevel != 0 )
   	{
	   	for (var i = 1; i <= currentLevel; i++) {
	   		current_path += levels[ ( i ) ] + "/";
	   	}
	}
    pathRemote = path;
    console.log(path + path_json + current_path + root_json + ".json");
    // using math floor to avoid caching
	d3.json((path + path_json + current_path + root_json + ".json?" + Math.floor(Math.random() * 100000)), function(error, graph) {
		if (error) throw error;
	       if(pastJson!= JSON.stringify(graph)){
               console.log("different jsons");
	           svg.selectAll("*").remove();
               link = svg.selectAll(".link"),
    node = svg.selectAll(".node");
	           pastJson=JSON.stringify(graph);
	           force
	      .nodes(graph.nodes)
	      .links(graph.links)
	      .start();
	  link = link.data(graph.links)
	    .enter().append("line")
	      .attr("class", "link");
	    
	  node = node.data(graph.nodes)
	    .enter().append("circle")
	      .attr("class", "node")
	      .attr("r", 12)
	      .attr("id", function(){index++;return "node"+(index-1);})
	      .call(drag)
          .style("fill", "red")
	      .on("dblclick",dblclick)
	      .on("mouseover",tip.show)
	      .on("mouseout",tip.hide);
	       index=0; 
        abc();   
    }

});
    force.start();
    setTimeout(function() {
  
//  for (var i = force.nodes().length * force.nodes().length; i > 0; --i) force.tick();
  force.stop();
      for (i=0;i<force.nodes().length;i++) {
        force.nodes()[i].fixed = true;
        }
  loading.remove();
}, animationTime);
    
}

// loading function, shows a message during the load time
function load(){
    loading = svg.append("text")
    .attr("x", width / 2)
    .attr("y", height / 2)
    .attr("dy", ".35em")
    .style("text-anchor", "middle")
    .text("Simulating. One moment please…"); 
}
function tick() {
  link.attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

  node.attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; });
}

// double click in a node
function dblclick(){
    load();
    // increment to know actual level
    currentLevel++;
    name =  d3.select(this).attr( "id" );
    levels[ ( currentLevel ) ] = name;
    changeLevel(currentLevel);
}

// function to change the color for the whole graph
function changeColor() {
    node = node.style("fill", (document.getElementById("color").value));
}

// change size for the edges
function changeSize() {
    lineWidth=document.getElementById("size").value;
    link.style("stroke-width", lineWidth/scale);
}

// creating an interval timer
function createInterval(){
    if (document.getElementById("timer").value!=""){
        clearInterval(update);
       timer=document.getElementById("timer").value;
    update=setInterval(updateData, timer*1000); 
    }
    
}

// update data calling the loadGraph function
function updateData(){
    console.log("Inside updateData");
    loadGraph(pathRemote);
}

// function to change the level, change to active the current level in the menu bar
function changeLevel(n) {
    console.log("Inside changeLevel");
    tip.hide;
    console.log(tip);
    currentLevel = n;
    enableLevel(currentLevel);
    name = levels[ ( currentLevel ) ];
    svg.selectAll("*").remove();
    loadGraph(pathRemote);
    createInterval();
    // active clicked level
    document.getElementById( 'l' + currentLevel ).setAttribute( 'class', 'active' );
}

// function to enable navbar button for previous levals
function enableLevel(leval) {
  document.getElementById("levels").innerHTML = " ";
  for (i = 0; i < currentLevel; i++) {
      document.getElementById("levels").innerHTML += "<li id='l" + i + "' onclick='changeLevel(" + 
                                                      i + ");'><a href='#'>Level " + i + "</a></li>";
  }
  document.getElementById("levels").innerHTML += "<li class='active' id='l" + 
                                                  leval + "' onclick='changeLevel(" + leval + 
                                                  ");'><a href='#'>Level " + leval + "</a></li>";
}

// redraw the graph
function redraw() {
    scale = d3.event.scale;
    dynamicSize();
    svg.selectAll(".node").style("stroke-width",1.5/scale+"px");
    svg.selectAll("line.link").style("stroke-width", lineWidth/scale+"px");
      svg.attr("transform",
          "translate(" + d3.event.translate + ")"
          + " scale(" + d3.event.scale + ")");
}

function abc(){
    svg.selectAll(".node").attr("a", function(d){
        var node_over_path = "node" + d.index + "/";
        d3.json(pathRemote+path_json + current_path + node_over_path + root_json + ".json", function(error, graph) {           
        if (error) {
            nNodes = 0;
            svg.select("#node"+d.index).attr("originalSize", 12);
            svg.select("#node"+d.index).attr("numberOfNodes", nNodes);
        }
           
        else {
            nNodes = graph.nodes.length;
            svg.select("#node"+d.index).attr("numberOfNodes", nNodes);
            if(nNodes+12<=maximumNodeSize){
                 svg.select("#node"+d.index).attr("r", nNodes+12);
                svg.select("#node"+d.index).attr("originalSize", nNodes+12);
            }else{
                 svg.select("#node"+d.index).attr("r", maximumNodeSize);
                 svg.select("#node"+d.index).attr("originalSize", maximumNodeSize);
            }
        
        }
    });   
    });   
}

// dynamic size considering how many nodes it has inside
function dynamicSize(){
  if (document.getElementById('dynsize').checked) 
  {
      svg.selectAll(".node").attr("r",function(d){return svg.select("#node"+d.index).attr("originalSize")/scale});
  }
  else{
      svg.selectAll(".node").attr("r",12/scale);
  }
}

// go to graph button clicked, load the graph
function goToGraph() {
  console.log("inside goToGraph");
  document.getElementById("settings").style.visibility = "visible";
  document.getElementById("menuRight").style.pointerEvents = "auto";
  document.getElementById("levels").style.pointerEvents = "auto";
  var radios = document.getElementsByName('files');
  document.getElementById("modal").style.display = "none";

  console.log("Text field: " + document.getElementById("fname").value);
  loadGraph(document.getElementById("fname").value);
}