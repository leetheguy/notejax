class NotesController < ApplicationController
  respond_to :json, except: :index

  #TODO make sure delays are in place
  def delay_1() sleep(3) end
  def delay_2() sleep(1) end

  def index
    @notes = Note.all
    respond_to do |format|
      format.html
      format.json do
        delay_1
        render json: @notes
      end
    end
  end

  def show
    @note = Note.find(params[:id])
    delay_2
    render json: @note
  end

  def new
    @note = Note.new
    delay_2
    render json: @note
  end

  def edit
    @note = Note.find(params[:id])
    delay_2
    render json: @note
  end

  def create
    @note = Note.new(params[:note])
    delay_2
    if @note.save
      render json: @note, status: :created, location: @note
    else
      render json: @note.errors, status: :unprocessable_entity
    end
  end

  def update
    @note = Note.find(params[:id])
    delay_2
    if @note.update_attributes(params[:note])
      head :no_content
    else
      render json: @note.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @note = Note.find(params[:id])
    @note.destroy
    delay_2
    head :no_content
  end
end
