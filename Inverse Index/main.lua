local fs = require("lfs")

local dump = require("dump")
local lexicon = require("lexicon")

local index = {}
local query_terms = {}

lexicon.setup(index, fs.currentdir() .. "/resource")

while true do
  print("Enter query, empty to quit:")

  local term = io.read("*l")
  
  if #term == 0 then
    break
  end

  for _t in string.gmatch(string.lower(term), "%S+") do
    table.insert(query_terms, string.lower(_t))
  end

  local result = lexicon.filter(index, query_terms)
  
  print(#result .. " results: " .. dump(result))  
end

print("goodbye")