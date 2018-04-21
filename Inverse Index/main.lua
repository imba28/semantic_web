
local fs = require("lfs")

local subdir = "Inverse Index"
local path = fs.currentdir() .. "/" .. subdir

local intersect = require(subdir .. ".operations").intersect

local function setupIndex(index)
  local resource_path = path .. "/resource"

  for file in fs.dir(resource_path) do
    if file ~= "." and file ~= ".." then
      for line in io.lines(resource_path .. "/" .. file) do
        for i in string.gmatch(line, "%S+") do
          local word = string.match(i, "[a-zA-Z0-9]+") -- filter chars and digits 
          if word and #word > 1 then -- if not nil and length > 1
            word = string.lower(word)
            if not index[word] then
              index[word] = {}
            end

            table.insert(index[word], file)
          end
        end
      end
    end
  end
end

local function filterIndex(index, query_terms)
  local postings = {}
  
  for _, term in pairs(query_terms) do
    if index[term] then
      table.insert(postings, index[term])
    else 
      table.insert(postings, {})
    end
  end
  
  local result
  
  for i in pairs(postings) do
    if not result then
      result = postings[i]
    else 
      result = intersect(result, postings[i])
    end
  end
  
  return result and result or {}
end

local index = {}
setupIndex(index)

local query_terms = {}

while true do
  print("Enter query, empty to quit:")

  local term = io.read("*l")
  if #term == 0 then
    break
  end
  
  table.insert(query_terms, string.lower(term))
  local result = filterIndex(index, query_terms)
  
  print(#result .. " results:")
  
  for _, resource in pairs(result) do
    print(resource)
  end
end

print("goodbye")