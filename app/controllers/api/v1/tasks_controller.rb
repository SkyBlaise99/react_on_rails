module Api
  module V1
    class TasksController < ApplicationController
      protect_from_forgery with: :null_session

      def index
        tasks = Task.order(:id).all
        render json: TaskSerializer.new(tasks).serialized_json
      end

      def show
        id = params[:id]
        task = Task.find_by_id(id)

        if task
          render json: TaskSerializer.new(task).serialized_json
        else
          render json: { error: "ID '" + id + "' not found" }, status: 422
        end
      end

      def create
        task = Task.new(task_params)

        if task.save
          render json: TaskSerializer.new(task).serialized_json
        else
          render json: { error: task.errors.messages }, status: 422
        end
      end

      def update
        task = Task.find(params[:id])

        if task.update(task_params)
          render json: TaskSerializer.new(task).serialized_json
        else
          render json: { error: task.errors.messages }, status: 422
        end
      end

      def destroy
        task = Task.find(params[:id])

        if task.destroy
          head :no_content
        else
          render json: { error: task.errors.message }, status: 422
        end
      end

      private

      def task_params
        params.require(:task).permit(:description, :is_done, :due_date, :note, :is_pinned)
      end
    end
  end
end
