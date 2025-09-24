import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  CheckSquare, 
  Clock, 
  AlertTriangle, 
  User, 
  Calendar,
  Plus,
  Filter
} from "lucide-react";
import { useState } from "react";

const todoData = [
  {
    id: 1,
    title: "Review updated financial projections",
    description: "Analyze Q1-Q4 projections with management team",
    priority: "high",
    dueDate: "2024-03-25",
    assignee: "John Smith",
    category: "Financial",
    completed: false,
    urgent: true
  },
  {
    id: 2,
    title: "Schedule buyer management presentation",
    description: "Coordinate with top 3 interested buyers for next week",
    priority: "high",
    dueDate: "2024-03-22",
    assignee: "Sarah Johnson",
    category: "Marketing",
    completed: false,
    urgent: true
  },
  {
    id: 3,
    title: "Upload insurance documentation",
    description: "Provide all insurance policies and claims history",
    priority: "medium",
    dueDate: "2024-03-28",
    assignee: "Michael Chen",
    category: "Legal",
    completed: false,
    urgent: false
  },
  {
    id: 4,
    title: "Finalize data room organization",
    description: "Ensure all documents are properly categorized",
    priority: "medium",
    dueDate: "2024-03-30",
    assignee: "Emily Davis",
    category: "Operations",
    completed: true,
    urgent: false
  },
  {
    id: 5,
    title: "Prepare working capital analysis",
    description: "Detailed breakdown of working capital requirements",
    priority: "low",
    dueDate: "2024-04-05",
    assignee: "David Wilson",
    category: "Financial",
    completed: false,
    urgent: false
  }
];

const PriorityBadge = ({ priority }: { priority: string }) => {
  const variants = {
    high: "bg-danger/10 text-danger border-danger/20",
    medium: "bg-warning/10 text-warning border-warning/20",
    low: "bg-muted text-muted-foreground border-border"
  };
  
  return (
    <Badge variant="outline" className={variants[priority as keyof typeof variants]}>
      {priority}
    </Badge>
  );
};

const CategoryBadge = ({ category }: { category: string }) => {
  const variants = {
    Financial: "bg-primary/10 text-primary border-primary/20",
    Legal: "bg-success/10 text-success border-success/20",
    Marketing: "bg-warning/10 text-warning border-warning/20",
    Operations: "bg-muted text-muted-foreground border-border"
  };
  
  return (
    <Badge variant="outline" className={variants[category as keyof typeof variants]}>
      {category}
    </Badge>
  );
};

const getDaysUntilDue = (dueDate: string) => {
  const today = new Date();
  const due = new Date(dueDate);
  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export function TodoSection() {
  const [todos, setTodos] = useState(todoData);
  const [filter, setFilter] = useState("all");

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case "pending":
        return !todo.completed;
      case "completed":
        return todo.completed;
      case "urgent":
        return todo.urgent && !todo.completed;
      default:
        return true;
    }
  });

  const pendingCount = todos.filter(t => !t.completed).length;
  const urgentCount = todos.filter(t => t.urgent && !t.completed).length;
  const completedCount = todos.filter(t => t.completed).length;

  return (
    <div className="space-y-6">
      {/* Todo Overview */}
      <Card className="bg-gradient-card shadow-medium border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckSquare className="h-5 w-5 text-primary" />
            Action Items & To-Dos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-danger mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Urgent</p>
              <p className="font-semibold text-foreground">{urgentCount}</p>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <Clock className="h-5 w-5 text-warning mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="font-semibold text-foreground">{pendingCount}</p>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <CheckSquare className="h-5 w-5 text-success mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="font-semibold text-foreground">{completedCount}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters and Actions */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button 
            variant={filter === "all" ? "default" : "outline"} 
            size="sm"
            onClick={() => setFilter("all")}
          >
            All ({todos.length})
          </Button>
          <Button 
            variant={filter === "pending" ? "default" : "outline"} 
            size="sm"
            onClick={() => setFilter("pending")}
          >
            Pending ({pendingCount})
          </Button>
          <Button 
            variant={filter === "urgent" ? "default" : "outline"} 
            size="sm"
            onClick={() => setFilter("urgent")}
          >
            Urgent ({urgentCount})
          </Button>
          <Button 
            variant={filter === "completed" ? "default" : "outline"} 
            size="sm"
            onClick={() => setFilter("completed")}
          >
            Completed ({completedCount})
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button className="bg-gradient-primary" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>
      </div>

      {/* Todo List */}
      <div className="space-y-3">
        {filteredTodos.map((todo) => {
          const daysUntilDue = getDaysUntilDue(todo.dueDate);
          const isOverdue = daysUntilDue < 0;
          const isDueSoon = daysUntilDue <= 2 && daysUntilDue >= 0;

          return (
            <Card key={todo.id} className={`shadow-soft transition-all hover:shadow-medium ${
              todo.completed ? 'opacity-60' : ''
            } ${todo.urgent && !todo.completed ? 'ring-1 ring-danger/20' : ''}`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <Checkbox 
                    checked={todo.completed}
                    onCheckedChange={() => toggleTodo(todo.id)}
                    className="mt-1"
                  />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className={`font-medium ${todo.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                          {todo.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {todo.description}
                        </p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <PriorityBadge priority={todo.priority} />
                        <CategoryBadge category={todo.category} />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <User className="h-4 w-4" />
                          <span>{todo.assignee}</span>
                        </div>
                        <div className={`flex items-center gap-1 ${
                          isOverdue ? 'text-danger' : isDueSoon ? 'text-warning' : 'text-muted-foreground'
                        }`}>
                          <Calendar className="h-4 w-4" />
                          <span>
                            {todo.dueDate}
                            {isOverdue && ` (${Math.abs(daysUntilDue)} days overdue)`}
                            {isDueSoon && daysUntilDue === 0 && ' (Due today)'}
                            {isDueSoon && daysUntilDue === 1 && ' (Due tomorrow)'}
                            {isDueSoon && daysUntilDue === 2 && ' (Due in 2 days)'}
                          </span>
                        </div>
                      </div>
                      {todo.urgent && !todo.completed && (
                        <Badge className="bg-danger text-danger-foreground">
                          URGENT
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredTodos.length === 0 && (
        <Card className="shadow-soft">
          <CardContent className="p-8 text-center">
            <CheckSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold text-foreground mb-2">No tasks found</h3>
            <p className="text-muted-foreground">
              {filter === "all" ? "No tasks available" : `No ${filter} tasks found`}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}