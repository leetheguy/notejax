class Note
  include Mongoid::Document
  field :name,     type: String
  field :content,  type: String
  field :user,     type: String
  
  validates :name,     presence: true, length: { minimum: 5 }
  validates :content,  length: { minimum: 20 }
  validates :user,     presence: true
end
