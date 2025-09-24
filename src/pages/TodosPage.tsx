import { TodoSection } from "@/components/TodoSection";

const TodosPage = () => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Action Items & To-Dos</h2>
        <p className="text-muted-foreground">
          Manage tasks, deadlines, and track completion of critical deal activities
        </p>
      </div>
      
      <TodoSection />
    </div>
  );
};

export default TodosPage;