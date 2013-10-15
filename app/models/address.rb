class Address
  include Mongoid::Document
  field :name, type: String
  field :line_1, type: String
  field :line_2, type: String
  field :city, type: String
  field :state, type: String
  field :zip, type: String
end
