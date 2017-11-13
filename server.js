var app=require("express")();
var bodyParser=require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

var mongoose=require("mongoose");
mongoose.connect("mongodb://localhost/restful_task_api");
var TaskSchema=new mongoose.Schema({
	title: {type: String, required: true},
	description: {type: String, default: ""},
	completed: {type: Boolean, default: "false"},
	created_at: {type: Date, default: Date.now},
	updated_at: {type: Date, default: Date.now}
});
mongoose.model("Task", TaskSchema);
var Task=mongoose.model("Task");

app.get("/tasks", function(req, res){
	Task.find({}, function(err, tasks){
		if(err){
			res.json("Error loading all tasks");
		}else{
			res.json(tasks);
		};
	});
});

app.get("/tasks/:id", function(req, res){
	Task.findOne({_id: req.params.id}, function(err, task){
		if(err){
			res.json("Error loading the task");
		}else{
			res.json(task);
		};
	});
});

app.post("/tasks", function(req, res){
	task=new Task(req.body);
	task.save(function(err){
		if(err){
			res.json("Error creating task");
		}else{
			res.json(task);
		};
	});
});

app.put("/tasks/:id", function(req, res){
	Task.findOne({_id: req.params.id}, function(err, task){
		if(err){
			res.json("Error updating task");
		}else{
			task.set(req.body);
			task.updated_at=Date.now();
			task.save(function(err, task){
				if(err){
					res.json("Error updating task");
				}else{
					res.json(task);
				}
			})
		};
	});
})

app.delete("/tasks/:id", function(req, res){
	Task.remove({_id: req.params.id}, function(err){
		if(err){
			res.json("Error deleting task");
		}else{
			res.json("Successfully deleted task");
		}
	})
})

app.listen(8000, function(){
    console.log("listening on port 8000");
});