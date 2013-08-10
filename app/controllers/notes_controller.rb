class NotesController < ApplicationController
  respond_to :json, except: :page

  def page
    @notes = Note.all
  end

  def index
    @notes = Note.all
    render json: @notes
  end

  def show
    @note = Note.find(params[:id])
    render json: @note
  end

  def new
    @note = Note.new
    render json: @note
  end

  def edit
    @note = Note.find(params[:id])
    render json: @note
  end

  def create
    @note = Note.new(params[:note])
    if @note.save
      render json: @note, status: :created, location: @note
    else
      render json: @note.errors, status: :unprocessable_entity
    end
  end

  def update
    @note = Note.find(params[:id])
    if @note.update_attributes(params[:note])
      head :no_content
    else
      render json: @note.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @note = Note.find(params[:id])
    @note.destroy
    head :no_content
  end
end
