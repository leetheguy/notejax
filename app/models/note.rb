class Note
  include Mongoid::Document
  field :name, type: String
  field :content, type: String
  field :user, type: String
end
