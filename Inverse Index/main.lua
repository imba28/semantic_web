
subdir = "Inverse Index"

local fs = require("lfs")
local path = fs.currentdir() .. "/" .. subdir

local dump = require(subdir .. ".dump")
local lexicon = require(subdir .. ".lexicon")

local index = {}
local query_terms = {}

lexicon.setup(index, path .. "/resource")

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
  print()
end

print("goodbye")