
subdir = "Inverse Index"

local fs = require("lfs")
local path = fs.currentdir() .. "/" .. subdir

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

  table.insert(query_terms, string.lower(term))
  local result = lexicon.filter(index, query_terms)
  
  print(#result .. " results:")
  
  for _, resource in pairs(result) do
    print(resource)
  end
end

print("goodbye")