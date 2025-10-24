/**
 * Performance Test Suite for PAV Asset Verification App
 * Tests filtering, sorting, and rendering performance with large datasets
 */

// Mock data generator
function generateMockAssets(count) {
  const assetTypes = ['Laptop', 'Desktop', 'Monitor', 'Printer', 'Scanner'];
  const makes = ['Dell', 'HP', 'Lenovo', 'Canon', 'Epson', 'Samsung', 'LG'];
  const models = ['ModelA', 'ModelB', 'ModelC', 'ModelD', 'ModelE'];
  const pavStatuses = ['Available', 'Not Available'];
  const branches = ['BR001', 'BR002', 'BR003', 'BR004', 'BR005'];
  
  const assets = new Array(count);
  for (let i = 0; i < count; i++) {
    assets[i] = {
      '_pav_id': `asset-${i}`,
      'Asset Code': `AC${String(i).padStart(6, '0')}`,
      'Serial Number': `SN${String(Math.floor(Math.random() * 1000000)).padStart(6, '0')}`,
      'Make': makes[Math.floor(Math.random() * makes.length)],
      'Model': models[Math.floor(Math.random() * models.length)],
      'Asset Type': assetTypes[Math.floor(Math.random() * assetTypes.length)],
      'Asset status': 'In use',
      'PAV Status': pavStatuses[Math.floor(Math.random() * pavStatuses.length)],
      'PAV Date of visit (DD-MMM-YYYY i.e: 15-Mar-2021)': '2024-01-15',
      'Asset Availability Remarks': 'Available in same branch',
      'New Branch Code': branches[Math.floor(Math.random() * branches.length)],
      'Disposal Ticket': 'N/A',
      'Comment': '',
      'Engineer Name': 'Test Engineer'
    };
  }
  return assets;
}

// Optimized filtering function (same as AssetTable)
function safeLower(val) {
  return typeof val === 'string' ? val.toLowerCase() : '';
}

function filterAssets(assets, filters, search, searchCriteria) {
  if (!assets || !assets.length) return [];
  const s = search ? String(search).toLowerCase() : '';
  const { assetType, make, pavStatus } = filters;
  
  const result = [];
  for (let i = 0; i < assets.length; i++) {
    const asset = assets[i];
    
    // Apply filters first (most selective)
    if (assetType && asset['Asset Type'] !== assetType) continue;
    if (make && asset['Make'] !== make) continue;
    if (pavStatus && asset['PAV Status'] !== pavStatus) continue;
    
    // Apply search if present
    if (s) {
      let matches = false;
      if (searchCriteria === 'Serial Number') {
        matches = safeLower(asset['Serial Number']).includes(s);
      } else if (searchCriteria === 'Asset Code') {
        matches = safeLower(asset['Asset Code']).includes(s);
      } else if (searchCriteria === 'Asset make' || searchCriteria === 'Make') {
        matches = safeLower(asset['Make']).includes(s);
      } else {
        matches = (
          safeLower(asset['Serial Number']).includes(s) ||
          safeLower(asset['Model']).includes(s) ||
          safeLower(asset['Make']).includes(s) ||
          safeLower(asset['Asset Code']).includes(s)
        );
      }
      if (!matches) continue;
    }
    
    result.push(asset);
  }
  return result;
}

// Optimized sorting function (same as AssetTable)
function sortAssets(assets, sortBy, sortDir) {
  if (!assets || assets.length === 0) return [];
  const copy = assets.slice();
  const direction = sortDir === 'asc' ? 1 : -1;
  
  copy.sort((a, b) => {
    const A = (a[sortBy] || '').toString().toLowerCase();
    const B = (b[sortBy] || '').toString().toLowerCase();
    return A < B ? -direction : A > B ? direction : 0;
  });
  return copy;
}

// Calculate PAV status counts (same as AssetTable)
function calculateStatusCounts(assets) {
  const counts = {};
  for (let i = 0; i < assets.length; i++) {
    const status = assets[i]['PAV Status'] || 'Unknown';
    counts[status] = (counts[status] || 0) + 1;
  }
  return counts;
}

// Performance test runner
function runPerformanceTests() {
  console.log('🚀 Starting Performance Tests...\n');
  
  const testSizes = [100, 500, 1000, 5000, 10000];
  const results = [];
  
  for (const size of testSizes) {
    console.log(`\n📊 Testing with ${size} assets...`);
    const assets = generateMockAssets(size);
    
    // Test 1: Filtering performance
    const filterStart = performance.now();
    const filtered = filterAssets(assets, { assetType: 'Laptop' }, '', 'Serial Number');
    const filterEnd = performance.now();
    const filterTime = filterEnd - filterStart;
    
    // Test 2: Sorting performance
    const sortStart = performance.now();
    const sorted = sortAssets(filtered, 'Asset Code', 'asc');
    const sortEnd = performance.now();
    const sortTime = sortEnd - sortStart;
    
    // Test 3: Status counting performance
    const countStart = performance.now();
    const counts = calculateStatusCounts(filtered);
    const countEnd = performance.now();
    const countTime = countEnd - countStart;
    
    // Test 4: Search performance
    const searchStart = performance.now();
    const searched = filterAssets(assets, {}, 'AC00', 'Asset Code');
    const searchEnd = performance.now();
    const searchTime = searchEnd - searchStart;
    
    // Test 5: Combined operation (realistic scenario)
    const combinedStart = performance.now();
    const step1 = filterAssets(assets, { assetType: 'Laptop', make: 'Dell' }, '', 'Serial Number');
    const step2 = sortAssets(step1, 'Asset Code', 'asc');
    const step3 = calculateStatusCounts(step2);
    const combinedEnd = performance.now();
    const combinedTime = combinedEnd - combinedStart;
    
    const result = {
      size,
      filterTime: filterTime.toFixed(2),
      sortTime: sortTime.toFixed(2),
      countTime: countTime.toFixed(2),
      searchTime: searchTime.toFixed(2),
      combinedTime: combinedTime.toFixed(2),
      filteredCount: filtered.length,
      searchedCount: searched.length
    };
    
    results.push(result);
    
    console.log(`  ✓ Filter: ${result.filterTime}ms (${result.filteredCount} results)`);
    console.log(`  ✓ Sort: ${result.sortTime}ms`);
    console.log(`  ✓ Count: ${result.countTime}ms`);
    console.log(`  ✓ Search: ${result.searchTime}ms (${result.searchedCount} results)`);
    console.log(`  ✓ Combined: ${result.combinedTime}ms`);
  }
  
  console.log('\n\n📈 Performance Summary:\n');
  console.log('Size\tFilter\tSort\tCount\tSearch\tCombined');
  results.forEach(r => {
    console.log(`${r.size}\t${r.filterTime}ms\t${r.sortTime}ms\t${r.countTime}ms\t${r.searchTime}ms\t${r.combinedTime}ms`);
  });
  
  // Performance validation
  console.log('\n\n✅ Performance Validation:\n');
  const largestTest = results[results.length - 1];
  
  // Target: operations should complete in reasonable time even for 10k records
  const targets = {
    filter: 50,   // 50ms for filtering
    sort: 50,     // 50ms for sorting
    count: 10,    // 10ms for counting
    search: 50,   // 50ms for searching
    combined: 150 // 150ms for combined operations
  };
  
  const filterPass = parseFloat(largestTest.filterTime) < targets.filter;
  const sortPass = parseFloat(largestTest.sortTime) < targets.sort;
  const countPass = parseFloat(largestTest.countTime) < targets.count;
  const searchPass = parseFloat(largestTest.searchTime) < targets.search;
  const combinedPass = parseFloat(largestTest.combinedTime) < targets.combined;
  
  console.log(`Filter (10k records): ${largestTest.filterTime}ms ${filterPass ? '✅ PASS' : '❌ FAIL'} (target: <${targets.filter}ms)`);
  console.log(`Sort (10k records): ${largestTest.sortTime}ms ${sortPass ? '✅ PASS' : '❌ FAIL'} (target: <${targets.sort}ms)`);
  console.log(`Count (10k records): ${largestTest.countTime}ms ${countPass ? '✅ PASS' : '❌ FAIL'} (target: <${targets.count}ms)`);
  console.log(`Search (10k records): ${largestTest.searchTime}ms ${searchPass ? '✅ PASS' : '❌ FAIL'} (target: <${targets.search}ms)`);
  console.log(`Combined (10k records): ${largestTest.combinedTime}ms ${combinedPass ? '✅ PASS' : '❌ FAIL'} (target: <${targets.combined}ms)`);
  
  const allPass = filterPass && sortPass && countPass && searchPass && combinedPass;
  console.log(`\n${allPass ? '🎉 All performance targets met!' : '⚠️  Some performance targets not met'}`);
  
  return { results, allPass };
}

// Run tests if executed directly (Node.js environment)
if (typeof module !== 'undefined' && require.main === module) {
  runPerformanceTests();
}

// Export for use in other tests
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    generateMockAssets,
    filterAssets,
    sortAssets,
    calculateStatusCounts,
    runPerformanceTests
  };
}
