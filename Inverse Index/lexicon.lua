local fs = require("lfs")
local intersect = require("operations").intersect

local function setup(index, path)
  for file in fs.dir(path) do
    if file ~= "." and file ~= ".." then
      for line in io.lines(path .. "/" .. file) do
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

local function filter(index, query_terms)
  local postings = {}
  local result
  
  for _, term in pairs(query_terms) do
    if index[term] then
      table.insert(postings, index[term])
    else 
      table.insert(postings, {})
    end
  end
  
  for i in pairs(postings) do
    if not result then
      result = postings[i]
    else 
      result = intersect(result, postings[i])
    end
  end
  
  table.sort(result)
  return result and result or {}
end

return {
  setup = setup,
  filter = filter
}