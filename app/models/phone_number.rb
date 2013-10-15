class PhoneNumber
  include Mongoid::Document
  field :name, type: String
  field :number, type: String
end
